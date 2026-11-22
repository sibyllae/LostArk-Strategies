import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { cx } from '@/utils/cx';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({ value, onChange, placeholder, className }: SearchInputProps) {
  return (
    <Input
      size='large'
      allowClear
      value={value}
      onChange={(event) => onChange(event.target.value)}
      prefix={<SearchOutlined className='mr-1 text-zinc-500' />}
      placeholder={placeholder}
      aria-label={placeholder ?? '搜尋'}
      className={cx('w-full', className)}
    />
  );
}
