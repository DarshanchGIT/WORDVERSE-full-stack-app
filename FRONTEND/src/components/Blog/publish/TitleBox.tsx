interface TitleBoxProps {
  title: string;
  setTitle: (value: string) => void;
}
export const TitleBox = ({ title, setTitle }: TitleBoxProps) => {
  return (
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Enter your title..."
      className="w-full bg-transparent text-4xl font-bold text-white mb-8 placeholder-gray-500 focus:outline-none"
    />
  );
};
