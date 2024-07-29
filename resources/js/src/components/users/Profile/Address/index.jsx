import Title from "../../../../components/all/Title";

export default function Address() {
    return (
        <>
            <Title>TopZone - Sổ địa chỉ</Title>
            <div className="min-h-full border border-solid border-gray-400 rounded-lg mb-5 bg-gray-50">
                <h1 className="text-gray-950 text-3xl font-style:nomal mt-7 ml-9">
                    Địa chỉ của tôi
                </h1>
                <h2 className="text-gray-950 text-xl mt-5 ml-9">Sổ địa chỉ</h2>
                <button className="bg-gray-50 hover:bg-gray-500 text-xl font-bold py-2 px-4 rounded-lg mt-4 ml-9">
                    Thêm địa chỉ mới
                </button>
            </div>
        </>
    );
}
