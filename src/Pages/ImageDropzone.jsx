import React, { useState, useCallback } from 'react';
import { AppProvider, DropZone, LegacyStack, Thumbnail, Text } from '@shopify/polaris';
import { NoteIcon } from '@shopify/polaris-icons';

const ImageDropzone = () => {
    const [files, setFiles] = useState([]);

    const handleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles, event) => {
            event && event.preventDefault();
            setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
        },
        []
    );

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    const fileUpload = (
        <DropZone.FileUpload
            actionTitle={files.length > 0 ? 'Upload more' : 'Upload'}
            actionHint="or drag and drop"
            accept={validImageTypes.join(',')}
        />
    );

    const uploadedFiles =
        files.length > 0 && (
            <div style={{ padding: '0' }}>
                <LegacyStack vertical>
                    {files.map((file, index) => (
                        <LegacyStack alignment="center" key={index}>
                            <Thumbnail
                                size="small"
                                alt={file.name}
                                source={
                                    validImageTypes.includes(file.type)
                                        ? window.URL.createObjectURL(file)
                                        : NoteIcon
                                }
                            />
                            <div>
                                {file.name}{' '}
                                <Text variant="bodySm" as="p">
                                    {file.size} bytes
                                </Text>
                            </div>
                        </LegacyStack>
                    ))}
                </LegacyStack>
            </div>
        );

    return (
        <div>
            <AppProvider>
                <DropZone onDrop={handleDropZoneDrop}>
                    {fileUpload}
                </DropZone>
                {uploadedFiles}
            </AppProvider>
        </div>
    );
};

export default ImageDropzone;
