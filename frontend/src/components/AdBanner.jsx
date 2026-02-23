import React, { useEffect, useRef } from 'react';

const AdBanner = ({ 
  width = 300, 
  height = 250, 
  zoneKey = 'a9ccc86e24f3e6c6f476eb54004b829a',
  className = '' 
}) => {
  const bannerRef = useRef(null);

  useEffect(() => {
    const container = bannerRef.current;
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    // Create iframe to isolate the ad script
    const iframe = document.createElement('iframe');
    iframe.width = width;
    iframe.height = height;
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no';
    
    container.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    
    // The ad script content
    const scriptContent = `
      <html>
        <body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;">
          <script type="text/javascript">
            atOptions = {
              'key' : '${zoneKey}',
              'format' : 'iframe',
              'height' : ${height},
              'width' : ${width},
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://www.highperformanceformat.com/${zoneKey}/invoke.js"></script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(scriptContent);
    doc.close();

    return () => {
      // Cleanup if needed
      // No strict cleanup needed for container as React handles it, 
      // but clearing innerHTML prevents duplicates on fast re-renders
      if (container) container.innerHTML = '';
    };
  }, [width, height, zoneKey]);

  return (
    <div 
      ref={bannerRef} 
      className={`ad-container flex justify-center items-center my-4 ${className}`}
      style={{ minHeight: height, minWidth: width }}
    />
  );
};

export default AdBanner;
