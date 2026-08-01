const GenderCheckbox = ({ onCheckboxChange, selectedGender }) => {
  return (
    <div className="flex gap-4 mt-2">
      {["male", "female"].map((gender) => (
        <button
          type="button"
          key={gender}
          onClick={() => onCheckboxChange(gender)}
          className={`flex-1 py-2.5 rounded-xl border text-sm font-medium capitalize transition-all ${
            selectedGender === gender
              ? "bg-primary-soft border-primary text-primary"
              : "bg-surface-2 border-[var(--border)] text-ink-muted hover:border-primary"
          }`}
        >
          {gender}
        </button>
      ))}
    </div>
  );
};

export default GenderCheckbox;
