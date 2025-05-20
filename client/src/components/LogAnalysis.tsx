import styled from 'styled-components';
import { LogAnalysis } from '@common/types/logAnalysis';
import Badge from './Badge';
import { severityColors, confidenceColors } from '@common/utils/colors';

interface LogAnalysisProps {
  analysis: LogAnalysis;
}

const Container = styled.div`
  padding: 1rem;
  background-color: #F4F4F4;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #000500;
`;

const Section = styled.div`
  margin-bottom: 1rem;
`;

const SectionTitle = styled.span`
  font-size: 0.875rem;
  color: #000500;
`;

const SectionContent = styled.p`
  margin-top: 0.25rem;
  color: #000500;
`;

const MetricsContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const Metric = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

function LogAnalysisDisplay({ analysis }: LogAnalysisProps) {
  return (
    <Container>
      <Header>
        <Title>Analysis Results</Title>
        <MetricsContainer>
          <Metric>
            <SectionTitle>Severity</SectionTitle>
            <Badge color={severityColors[analysis.severity]} text={analysis.severity} />
          </Metric>
          <Metric>
            <SectionTitle>Confidence</SectionTitle>
            <Badge color={confidenceColors[analysis.confidence]} text={analysis.confidence} />
          </Metric>
        </MetricsContainer>
      </Header>
      <Section>
        <SectionTitle>Problem</SectionTitle>
        <SectionContent>{analysis.problem}</SectionContent>
      </Section>
      <Section>
        <SectionTitle>Solution</SectionTitle>
        <SectionContent>{analysis.solution}</SectionContent>
      </Section>
    </Container>
  );
}

export default LogAnalysisDisplay;