import { LLMService } from './llmService';

describe('LLMService', () => {
  let llmService: LLMService;

  beforeEach(() => {
    llmService = new LLMService('dummy-api-key');
  });

  describe('sanitizeJsonResponse', () => {
    it('should handle JSON wrapped in markdown code blocks', () => {
      const input = '```json\n{\n  "problem": "test problem",\n  "solution": "test solution",\n  "severity": "high",\n  "confidence": "high"\n}\n```';
      const result = llmService.sanitizeJsonResponse(input);
      const parsed = JSON.parse(result);
      
      expect(parsed).toEqual({
        problem: 'test problem',
        solution: 'test solution',
        severity: 'high',
        confidence: 'high'
      });
    });

    it('should handle JSON with escaped newlines in strings', () => {
      const input = '```json\n{\n  "problem": "line1\\nline2",\n  "solution": "step1\\nstep2",\n  "severity": "medium",\n  "confidence": "high"\n}\n```';
      const result = llmService.sanitizeJsonResponse(input);
      const parsed = JSON.parse(result);
      
      expect(parsed).toEqual({
        problem: 'line1 line2',
        solution: 'step1 step2',
        severity: 'medium',
        confidence: 'high'
      });
    });

    it('should handle JSON with trailing commas', () => {
      const input = '```json\n{\n  "problem": "test",\n  "solution": "test",\n  "severity": "low",\n  "confidence": "medium",\n}\n```';
      const result = llmService.sanitizeJsonResponse(input);
      const parsed = JSON.parse(result);
      
      expect(parsed).toEqual({
        problem: 'test',
        solution: 'test',
        severity: 'low',
        confidence: 'medium'
      });
    });

    it('should handle JSON without markdown formatting', () => {
      const input = '{\n  "problem": "test",\n  "solution": "test",\n  "severity": "high",\n  "confidence": "high"\n}';
      const result = llmService.sanitizeJsonResponse(input);
      const parsed = JSON.parse(result);
      
      expect(parsed).toEqual({
        problem: 'test',
        solution: 'test',
        severity: 'high',
        confidence: 'high'
      });
    });

    it('should handle complex nested JSON with various formatting', () => {
      const input = '```json\n{\n  "problem": "Complex\\nproblem with\\nmultiple lines",\n  "solution": "Step 1\\nStep 2\\nStep 3",\n  "severity": "high",\n  "confidence": "medium",\n}\n```';
      const result = llmService.sanitizeJsonResponse(input);
      const parsed = JSON.parse(result);
      
      expect(parsed).toEqual({
        problem: 'Complex problem with multiple lines',
        solution: 'Step 1 Step 2 Step 3',
        severity: 'high',
        confidence: 'medium'
      });
    });

    it('should throw error for invalid JSON', () => {
      const input = '```json\n{\n  "problem": "test",\n  "solution": "test",\n  "severity": "high",\n  "confidence": "high"\n```';
      expect(() => llmService.sanitizeJsonResponse(input)).toThrow('No JSON object found in response');
    });

    it('should handle real-world Gemini response format', () => {
      const input = '```json\n' +
        '{\n' +
        '  "problem": "The error \\"Uncaught TypeError: invalid assignment to const \'a\'\\" indicates that the code is attempting to reassign a value to a variable that was declared with the `const` keyword.",\n' +
        '  "solution": "1. **Identify the problematic line of code:** Open the browser\'s developer tools.\\n2. **Correct the Assignment:** If the reassignment is unintentional, remove it.\\n3. **Test:** Reload the page.",\n' +
        '  "severity": "high",\n' +
        '  "confidence": "high"\n' +
        '}\n' +
        '```';
      
      const result = llmService.sanitizeJsonResponse(input);
      const parsed = JSON.parse(result);
      
      expect(parsed).toEqual({
        problem: 'The error "Uncaught TypeError: invalid assignment to const \'a\'" indicates that the code is attempting to reassign a value to a variable that was declared with the `const` keyword.',
        solution: '1. **Identify the problematic line of code:** Open the browser\'s developer tools. 2. **Correct the Assignment:** If the reassignment is unintentional, remove it. 3. **Test:** Reload the page.',
        severity: 'high',
        confidence: 'high'
      });
    });
  });
}); 