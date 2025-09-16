import React from 'react'
import PropTypes from 'prop-types'

const YoutubeEmbed = ({embedId, lessonTitle}) => {
  return (
    <div>
        <iframe
        width={"353"}
        height={"280"}
        src={`https://www.youtube.com/embed/${embedId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={`${lessonTitle}`}
        />
    </div>
  )
}

YoutubeEmbed.propTypes = {
    embedId: PropTypes.string.isRequired,
    lessonTitle: PropTypes.string.isRequired,
}

export default YoutubeEmbed