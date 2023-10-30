showCopy?: boolean
<div className="relative">

      {showCopy && (
        <a
          className="block absolute right-0 top-0 m-2 p-2 bg-neutral-600 rounded cursor-pointer"
          onClick={() => navigator.clipboard.writeText(value)}
        >
          <IoMdCopy />
        </a>
      )}
    </div>
