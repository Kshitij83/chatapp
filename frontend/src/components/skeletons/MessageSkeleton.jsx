const MessageSkeleton = () => {
  return (
    <>
      <div className="flex items-end gap-2.5 justify-start">
        <div className="skeleton-block w-8 h-8 rounded-full shrink-0" />
        <div className="skeleton-block h-14 w-44" />
      </div>
      <div className="flex items-end gap-2.5 justify-end">
        <div className="skeleton-block h-10 w-36" />
      </div>
      <div className="flex items-end gap-2.5 justify-start">
        <div className="skeleton-block w-8 h-8 rounded-full shrink-0" />
        <div className="skeleton-block h-12 w-52" />
      </div>
    </>
  );
};

export default MessageSkeleton;
