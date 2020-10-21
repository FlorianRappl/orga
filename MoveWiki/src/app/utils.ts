export function addCustomListener(
  name: string,
  cb: (ev: CustomEvent) => void
): () => void {
  document.addEventListener(name, cb);

  return () => {
    document.removeEventListener(name, cb);
  };
}

export function emitCustomEvent(name: string, details: any) {
  document.dispatchEvent(new CustomEvent(name, {
    detail: details,
  }));
}
