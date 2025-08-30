'use client';

import { ActualFileObject } from "filepond";
import { FilePond } from "react-filepond";

const FilePicker = () => {
    const handleFiles = (files: ActualFileObject[]) => {
        console.log(files);
    }
    return <div>
        <FilePond
            className={'w-full'}
            onupdatefiles={(fileItems) =>{
                const files = fileItems.map((item) => item.file);
                handleFiles(files);
            }}
            allowMultiple={true}
            maxFiles={4}
            name={'images'}
            labelIdle={'Drag & drop your files or <span class="filepond--label-action">browse</span>'}
            instantUpload={false}
        />
    </div>
}

export default FilePicker;