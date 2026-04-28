export const Dashboard = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className="
      bg-slate-300
      h-80
      w-80
      flex
      justify-center
      items-center
      rounded-lg
      shadow-lg
      "
      >
        <input className="bg-white p-1 rounded-3xl" />
        <div>
          <button className="bg-rose-200 p-1 rounded-3xl ml-2">Submit</button>
        </div>
      </div>
    </div>
  );
};
