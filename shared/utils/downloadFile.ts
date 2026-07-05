export const handleDownload = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
  
    const blobUrl = window.URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
  
    document.body.appendChild(a);
    a.click();
  
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  };