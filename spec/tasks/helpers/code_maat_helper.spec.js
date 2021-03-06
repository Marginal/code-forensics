/*global require_src*/
var _ = require('lodash');

var Helper   = require_src('tasks/helpers/code_maat_helper'),
    codeMaat = require_src('analysers/code_maat');

describe('CodeMaatHelper', function() {
  beforeEach(function() {
    this.subject = new Helper({});
    this.mockAnalyser =  {
      isSupported: jasmine.createSpy().and.returnValue('support-info'),
      fileAnalysisStream: jasmine.createSpy().and.returnValue('test_result')
    };
    spyOn(codeMaat, 'analyser').and.returnValue(this.mockAnalyser);
  });

  _.each({
    'revisions': 'revisionsAnalysis',
    'summary': 'summaryAnalysis',
    'soc': 'sumCouplingAnalysis',
    'coupling': 'temporalCouplingAnalysis',
    'authors': 'authorsAnalysis',
    'main-dev': 'mainDevAnalysis',
    'entity-effort': 'effortAnalysis',
    'entity-ownership': 'codeOwnershipAnalysis',
    'communication': 'communicationAnalysis',
    'abs-churn': 'absoluteChurnAnalysis',
    'entity-churn': 'entityChurnAnalysis'
  }, function(analysis, instruction) {
    it('returns information on vcs support', function() {
      expect(this.subject[analysis].isSupported()).toEqual('support-info');
    });

    it('returns the codemaat analysis of the input file', function() {
      var result = this.subject[analysis]('test_input', 'test_options');

      expect(result).toEqual('test_result');
      expect(codeMaat.analyser).toHaveBeenCalledWith(instruction);
      expect(this.mockAnalyser.fileAnalysisStream).toHaveBeenCalledWith('test_input', 'test_options');
    });
  });
});
