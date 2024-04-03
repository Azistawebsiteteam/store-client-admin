import React, { useRef } from 'react'
import JoditEditor from 'jodit-react';

const TextEditor = (props) => {
    const editor = useRef(null)
    const { content, setContent } = props
    return (
        <JoditEditor
            ref={editor}
            value={content}
            onChange={(newContent) => setContent(newContent)}
        />
    )
}

export default TextEditor