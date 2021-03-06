/**
 * Sets the colorscheme of tahe page
 * @param e The media query for the colorscheme setting
 */
export function setColorScheme(e: MediaQueryListEvent | MediaQueryList): void {
    if (e.matches) {
        document.documentElement.dataset.theme = "dark";
    } else {
        document.documentElement.dataset.theme = "light";
    }
}
