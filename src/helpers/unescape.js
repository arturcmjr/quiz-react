export function unescape(string) {
  return new DOMParser()
    .parseFromString(string, "text/html")
    .querySelector("html").textContent;
}

export default unescape;
