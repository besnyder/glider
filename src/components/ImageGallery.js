import React from 'react'
import { Grid, AutoSizer } from 'react-virtualized'
import ImageContainer from '../containers/ImageContainer'

const generateImageRenderer = ({ imageSize, imageIds, columnCount, columnWidth }) => ({
  style,
  columnIndex,
  rowIndex,
}) => {
  const index = rowIndex * columnCount + columnIndex

  if (index >= imageIds.length) return <div />

  const imageId = imageIds[index]
  const imageUrl = `/photos/${imageSize}x${imageSize}/${imageId}.jpg`

  //calculate x,y scale
  // const sx = (100 - 30 / columnWidth * 100) / 100;
  // const sy = (100 - 30 / columnWidth * 100) / 100;
  // selectedImgStyle.transform = `translateZ(0px) scale3d(${sx}, ${sy}, 1)`;

  return (
    <div key={imageId} style={style}>
      <ImageContainer imageId={imageId} imageUrl={imageUrl} index={index} imageIds={imageIds} />
    </div>
  )
}

const ImageGalleryComponent = ({ imageSize, imageIds }) => {
  return (
    <AutoSizer>
      {({ height, width }) => {
        const scrollBarWidth = 10
        width = width - scrollBarWidth
        const idealItemWidth = imageSize
        const itemCount = imageIds.length
        const columnCount = Math.max(1, Math.floor(width / idealItemWidth))
        const rowCount = Math.ceil(itemCount / columnCount)
        // We can now recalculate the columnCount knowing how many rows we must
        // display. In the typical case, this is going to be equivalent to
        // `columnCountEstimate`, but if in the case of 5 items and 4 columns, we
        // can fill out to display a a 3x2 with 1 hole instead of a 4x2 with 3
        // holes.
        /* const columnCount = Math.max(
          1,
          itemCount && Math.ceil(itemCount / rowCount)
        ); */

        const columnWidth = width / columnCount
        const rowHeight = columnWidth
        const cellRenderer = generateImageRenderer({
          imageSize,
          imageIds,
          columnCount,
          columnWidth,
        })
        return (
          <Grid
            cellRenderer={cellRenderer}
            columnWidth={columnWidth}
            columnCount={columnCount}
            rowCount={rowCount}
            rowHeight={rowHeight}
            width={width + scrollBarWidth}
            height={height}
          />
        )
      }}
    </AutoSizer>
  )
}

export default ImageGalleryComponent
