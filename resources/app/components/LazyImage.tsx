import React, { useRef, useEffect } from "react";

const LazyImage = ({ src, alt, ...props }) => {
  const imageRef = useRef(null);

  useEffect(() => {
    imageRef.current.src = src;
  }, [src]);

  return <img ref={imageRef} alt={alt} loading="lazy" {...props} />;
};

export default LazyImage;
