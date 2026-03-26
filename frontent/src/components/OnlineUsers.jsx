export default function OnlineUsers({ users }) {
  return (
    <div className="flex items-center gap-2">
      {users.map((user, i) => (
        <div key={i} className="flex items-center">
          <div className="w-8 h-8 bg-emerald-500 text-white text-xs rounded-2xl flex items-center justify-center ring-2 ring-emerald-400">
            {user[0]}
          </div>
        </div>
      ))}
      <span className="text-emerald-400 text-sm font-medium">
        {users.length} online
      </span>
    </div>
  );
}
