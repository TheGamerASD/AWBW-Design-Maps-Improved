// VARIABLES
declare var showBuildings: object;
declare var buildingVisible: boolean;
declare var currentBuilding: HTMLElement;
declare var gameContainer: HTMLElement;
declare var countryTable: HTMLElement;
declare var terrainTable: HTMLElement;
declare var buildingTable: HTMLElement;
declare var unitTable: HTMLElement;
declare var countryVisible: boolean;
declare var terrainVisible: boolean;
declare var unitVisible: boolean;
declare var buildingImage: HTMLImageElement;
declare var images: string[];
declare var country: string;
declare var mapheight: number;
declare var mapwidth: number;
declare var oldupdate: object;
declare var type: string;
declare var symndx: number;
declare var curndx: number;
declare var tops: number[];
declare var terrain: number[];
declare var code: string;
declare var units_img: string[];
declare var units: number[];

// FUNCTIONS
declare function getOffset(el: HTMLElement): Offset;
declare function applyCSS(el: HTMLElement, styles: CssStyles): void;
declare function closeMenu(el: HTMLElement): void;
declare function changeSquare(id: number, terrain_name: string, t: string): void;

// OBJECTS
declare type Offset = {
    left: number;
    top: number;
}
declare type CssStyles = {
    left: string;
    top: string;
    visibility: Visibility;
}
declare type Visibility = "visible" | "hidden";