import { FC } from 'react'

interface PaginationProps {
  page: number
  isActive: boolean
  onClick: (page: number) => void
}

export const PaginationButton: FC<PaginationProps> = ({
  page,
  isActive,
  onClick,
}) => {
  const handleClick = () => {
    onClick(page)
  }
  return (
    <li>
      <button
        className={` w-7 rounded-md ${
          isActive ? 'bg-[#424267]' : 'bg-[#2f2f46]'
        }`}
        onClick={handleClick}
      >
        {page}
      </button>
    </li>
  )
}
