"use client";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export default function Image({images}) {
    if (!images || images.length === 0) {
        return (
          <div className="h-64 bg-gray-100 flex items-center justify-center rounded-lg">
            <p className="text-gray-500">No images available</p>
          </div>
        );
    }

    return(
    <ImageList 
      sx={{ width: 800, height: 450 }} cols={3} rowHeight={300}
    >
      {images.map((img, index) => (
        <ImageListItem key={index}>
          <img
            srcSet={`${img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={`${img}`}
            alt={`Event image`}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
    );
}