import { IconCloud } from '@tabler/icons-react';
import { FC } from 'react';
import { useTranslation } from 'next-i18next';

interface Props {
  provider: string;
  onProviderChange: (provider: string) => void;
}

export const ProviderSelect: FC<Props> = ({ provider, onProviderChange }) => {
  const { t } = useTranslation('sidebar');

  return (
    <div className="flex items-center">
      <IconCloud size={18} />
      <select
        className="ml-2 cursor-pointer bg-transparent text-neutral-200"
        value={provider}
        onChange={(e) => onProviderChange(e.target.value)}
      >
        <option value="openai">OpenAI</option>
        <option value="azure">Azure</option>
        <option value="bedrock">AWS Bedrock</option>
      </select>
    </div>
  );
};