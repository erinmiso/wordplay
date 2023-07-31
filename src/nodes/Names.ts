import type { Grammar, Replacement } from './Node';
import type LanguageCode from '@locale/LanguageCode';
import Name from './Name';
import Token from './Token';
import { COMMA_SYMBOL } from '@parser/Symbols';
import Symbol from './Symbol';
import NameToken from './NameToken';
import Language from './Language';
import type Locale from '@locale/Locale';
import Purpose from '../concepts/Purpose';
import Emotion from '../lore/Emotion';
import Node, { list, node } from './Node';

export default class Names extends Node {
    readonly names: Name[];

    constructor(names: Name[]) {
        super();

        // Add name separators if lacking
        this.names = names.map((name, index) =>
            index > 0 && name.separator === undefined
                ? name.withSeparator()
                : name
        );

        this.computeChildren();
    }

    static make(names: string[]) {
        const list: Name[] = [];
        if (Array.isArray(names)) {
            let first = true;
            for (const name of names) {
                list.push(
                    new Name(
                        first
                            ? undefined
                            : new Token(COMMA_SYMBOL, Symbol.Separator),
                        new NameToken(name)
                    )
                );
                first = false;
            }
            return new Names(list);
        } else {
            return new Names(
                Object.keys(names).map(
                    (lang, index) =>
                        new Name(
                            index === 0
                                ? undefined
                                : new Token(COMMA_SYMBOL, Symbol.Separator),
                            new Token(names[lang as LanguageCode], Symbol.Name),
                            Language.make(lang)
                        )
                )
            );
        }
    }

    getGrammar(): Grammar {
        return [{ name: 'names', kind: list(node(Name)) }];
    }

    clone(replace?: Replacement) {
        return new Names(
            this.replaceChild<Name[]>('names', this.names, replace)
        ) as this;
    }

    simplify() {
        return new Names(this.names.map((name) => name.simplify()));
    }

    getPurpose() {
        return Purpose.Bind;
    }

    computeConflicts() {
        return [];
    }

    getLanguages() {
        return this.names
            .map((name) => name.getLanguage())
            .filter((lang): lang is LanguageCode => lang !== undefined);
    }

    hasLanguage() {
        return this.names.some((name) => name.hasLanguage());
    }

    getSharedName(names: Names) {
        return this.names.find(
            (name) => name.name && names.hasName(name.name.getText())
        );
    }

    sharesName(names: Names) {
        return this.getSharedName(names) !== undefined;
    }

    /** Returns a single grapheme name if there is one. */
    getSymbolicName() {
        return this.names.find((name) => name.isSymbolic())?.getName();
    }

    getPreferredNameString(
        preferred: Locale | Locale[],
        symbolic: boolean = true
    ) {
        preferred = Array.isArray(preferred) ? preferred : [preferred];
        return this.getPreferredName(preferred, symbolic)?.getName() ?? '-';
    }

    getPreferredName(
        preferred: Locale | Locale[],
        symbolic: boolean = true
    ): Name | undefined {
        const symbolicMatch = symbolic
            ? this.names.find((name) => name.isSymbolic())
            : undefined;
        if (symbolicMatch) return symbolicMatch;

        // Build the list of preferred languages
        const locales = Array.isArray(preferred) ? preferred : [preferred];
        // Find the first preferred locale with an exact match.
        const exact = this.names.find(
            (name) =>
                name.language &&
                locales.some(
                    (locale) =>
                        name.language !== undefined &&
                        name.language.isLocale(locale)
                )
        );
        if (exact) return exact;

        // See if there are any language matches.
        const languageMatch = this.names.find(
            (name) =>
                name.language &&
                locales.some(
                    (locale) =>
                        name.language !== undefined &&
                        name.language.isLocaleLanguage(locale)
                )
        );
        if (languageMatch) return languageMatch;

        // Default to the first name, if there is one.
        return this.names[0];
    }

    hasLocale(lang: LanguageCode) {
        return (
            this.names.find((name) => name.getLanguage() === lang) !== undefined
        );
    }

    getNames() {
        return this.names
            .map((a) => a.getName())
            .filter((n): n is string => n !== undefined);
    }

    getLowerCaseNames() {
        return this.names
            .map((a) =>
                a.getName()?.toLocaleLowerCase(a.getLanguage()?.substring(0, 2))
            )
            .filter((n): n is string => n !== undefined);
    }

    hasName(name: string) {
        return this.names.find((a) => a.getName() === name) !== undefined;
    }

    getNameStartingWith(prefix: string) {
        return this.names.find((name) => name.startsWith(prefix));
    }

    getNodeLocale(locale: Locale) {
        return locale.node.Names;
    }

    withName(name: string, language: LanguageCode) {
        const languageMatchIndex = this.names.findIndex(
            (name) => name.getLanguage() === language
        );
        const untaggedMatchIndex = this.names.findIndex(
            (name) => name.getLanguage() === undefined
        );
        const index =
            languageMatchIndex >= 0 ? languageMatchIndex : untaggedMatchIndex;

        const newName = Name.make(name, Language.make(language));
        return new Names(
            index < 0
                ? [...this.names, newName]
                : [
                      ...this.names.slice(0, index),
                      newName,
                      ...this.names.slice(index + 1),
                  ]
        );
    }

    getGlyphs() {
        return {
            symbols: this.getNames()[0],
            emotion: Emotion.kind,
        };
    }
}
