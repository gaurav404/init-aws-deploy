import FilePicker from "@/components/FilePicker";

export default async function UploadImagePage() {
    return <div>
        <p>Upload Image</p>
        <form >
            <FilePicker/>
        </form>
    </div>;
}