import { ColorType } from '@common/types/styles';
import styled from 'styled-components';

const BadgeContainer = styled.div<{ color: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: ${props => props.color.toString()};
  color: white;
  font-weight: bold;
  font-size: 0.75rem;
`;

function Badge({ text, color }: { text: string; color: ColorType }) {
  return <BadgeContainer color={color}>{text.toUpperCase()}</BadgeContainer>;
}

export default Badge;