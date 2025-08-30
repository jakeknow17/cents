interface AddButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const AddButton = ({ onClick }: AddButtonProps) => {
  return (
    <button className="btn btn-primary btn-circle btn-sm" onClick={onClick}>
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        ></path>
      </svg>
    </button>
  );
};

export default AddButton;
