import { IconDatabase, IconRobot } from '@tabler/icons-react';
import { FC, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { SidebarButton } from '../Sidebar/SidebarButton';

interface Props {
  knowledgeBaseId: string;
  modelArn: string;
  region: string;
  onKnowledgeBaseChange: (id: string) => void;
  onModelArnChange: (arn: string) => void;
  onRegionChange: (region: string) => void;
}

export const BedrockConfig: FC<Props> = ({
  knowledgeBaseId,
  modelArn,
  region,
  onKnowledgeBaseChange,
  onModelArnChange,
  onRegionChange,
}) => {
  const { t } = useTranslation('sidebar');
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <SidebarButton
        text={t('Bedrock Configuration')}
        icon={<IconRobot size={18} />}
        onClick={() => setIsExpanded(!isExpanded)}
      />
      
      {isExpanded && (
        <div className="ml-6 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-400">Knowledge Base ID</label>
            <input
              className="w-full rounded-md border border-neutral-600 bg-[#40414F] px-3 py-2 text-sm text-neutral-100 outline-none"
              type="text"
              value={knowledgeBaseId}
              onChange={(e) => onKnowledgeBaseChange(e.target.value)}
              placeholder="e.g., ZIKKTDBYEP"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-400">Model ARN</label>
            <input
              className="w-full rounded-md border border-neutral-600 bg-[#40414F] px-3 py-2 text-sm text-neutral-100 outline-none"
              type="text"
              value={modelArn}
              onChange={(e) => onModelArnChange(e.target.value)}
              placeholder="e.g., arn:aws:bedrock:us-east-1::foundation-model/amazon.nova-pro-v1:0"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-400">AWS Region</label>
            <select
              className="w-full rounded-md border border-neutral-600 bg-[#40414F] px-3 py-2 text-sm text-neutral-100 outline-none"
              value={region}
              onChange={(e) => onRegionChange(e.target.value)}
            >
              <option value="us-east-1">US East (N. Virginia)</option>
              <option value="us-west-2">US West (Oregon)</option>
              <option value="eu-west-1">EU (Ireland)</option>
              <option value="eu-central-1">EU (Frankfurt)</option>
              <option value="ap-northeast-1">Asia Pacific (Tokyo)</option>
              <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};