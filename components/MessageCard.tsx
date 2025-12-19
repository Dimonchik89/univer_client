export default function MessageCard({ message, onClick, }: { message: any, onClick: any }) {


  return (
    <div
      onClick={onClick}
      className="bg-white shadow p-4 rounded-lg cursor-pointer hover:shadow-md transition"
    >
      <h3 className="font-bold text-green-700">{message.title}</h3>
      <p className="text-gray-600">
        {message.message?.length > 50 ? message.message?.slice(0, 50) + "..." : message.message}
      </p>
    </div>
  );
}