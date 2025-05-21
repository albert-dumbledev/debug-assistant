import styled from 'styled-components';

export const Button = styled.button<{ disabled?: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${props => props.disabled ? '#F2F2F2' : '#89C2FA'};
  color: #000500;
  border-radius: 0.5rem;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  font-weight: 500;
  width: 200px;

  &:hover:not(:disabled) {
    background-color: #1485F5;
    color: white;
  }

  &:focus {
    border-color: #1485F5;
    box-shadow: 0 0 0 2px rgba(239, 118, 122, 0.1);
  }
`;

export const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  margin: 0.2rem;
  background-color: #F2F2F2;
  color: #000500;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  width: 150px;

  &:hover {
    background-color: #1485F5;
    color: white;
  }

  &:focus {
    border-color: #1485F5;
    box-shadow: 0 0 0 2px rgba(239, 118, 122, 0.1);
  }
`;