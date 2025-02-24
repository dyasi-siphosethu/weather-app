import { Location } from "@/constants/types";

export interface SearchBarProps {
    locations: Location[];
    handleTextDebounce: (text: string) => void;
    showSearch: boolean;
    toggleSearch: (value: boolean) => void;
    handleLocation: (loc: Location) => void;
    theme: { bgWhite: (opacity: number) => string };
}
  