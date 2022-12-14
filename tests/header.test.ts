import { randomSHA } from "./utils";

import { getDefaultSettings } from "../src/settings";
import { getConfig } from "../src/config";
import { Rule } from "../src/message-helper";

// Using default settings here
// If any test requires a custom setting, add that test in `input-parameters.test.ts`
describe("Header tests", () => {
  const settings = getDefaultSettings();
  const config = getConfig(settings);
  const commits = {
    scope1: `commit ${randomSHA()}
feat(web-server): Sample commit with scope

- Sample commit`,
    scope2: `commit ${randomSHA()}
feat(web-server-addon): Sample commit with-scope`,

    noScope1: `commit ${randomSHA()}
feat: Sample commit without scope

- Sample commit`,
    noScope2: `commit ${randomSHA()}
feat: Sample commit without-scope`,

    scopeHyphenNumber1: `commit ${randomSHA()}
feat(hello-123): Sample commit with-scope`,
    scopeHyphenNumber2: `commit ${randomSHA()}
feat(123-hello): Sample commit with-scope`,
    scopeHyphenNumber3: `commit ${randomSHA()}
feat(123-hello): Sample commit with-scope (#12)`,

    invalidScopeAtBeginning1: `commit ${randomSHA()}
(hello-123)feat: Sample commit`,
    invalidScopeAtBeginning2: `commit ${randomSHA()}
    
    (123)fix: Sample commit`,
    invalidScope1: `commit ${randomSHA()}
feat(-hello): Sample commit with-scope`,
    invalidScope2: `commit ${randomSHA()}
feat(web-server-addon-): Sample commit with-scope`,
    invalidScope3: `commit ${randomSHA()}
feat(---): Sample commit with-scope`,
    invalidScope4: `commit ${randomSHA()}
feat(hello-world)wrong: Sample commit with-scope`,

    invalid1: `commit ${randomSHA()}
hello Initial Commit`,

    fixup1: `commit ${randomSHA()}
fixup! fixup! fix(web-server): Sample subject`,
    fixup2: `commit ${randomSHA()}
fixup! feat(web): Sample subject with fixup!`,

    fixupWithBody1: `commit ${randomSHA()}
fixup! fixup! fix(web-server): Sample subject

- Sample commit fixup!`,
    fixupWithBody2: `commit ${randomSHA()}
fixup! feat(web): Sample subject with fixup!

- Sample commit fixup!
- Explanation sample`,

    exception1: `commit ${randomSHA()}
Initial Commit`,
    exception2: `commit ${randomSHA()}
Merge pull request #22 from adityaa30/dev`,
    exception3: `commit ${randomSHA()}
Merge ${randomSHA()} into ${randomSHA()}`,

    sample1: `commit ${randomSHA()}
docs(readme): Add workflow status badges`,
    sample2: `commit ${randomSHA()}
docs(readme): Add workflow status badges (#31)`,

    invalidType1: `commit ${randomSHA()}
notok(web-server): Sample commit

- Sample commit`,
    invalidType2: `commit ${randomSHA()}
invalid(web-server-addon): Sample commit`
  };

  const createRule = (message: string) => {
    return new Rule(message, config);
  };

  it("Scope has '-' symbol", () => {
    const rule1 = createRule(commits.scope1);
    const rule2 = createRule(commits.scope2);

    expect(rule1.check()).toEqual(true);
    expect(rule2.check()).toEqual(true);
  });

  it("Header has no scope", () => {
    const rule1 = createRule(commits.noScope1);
    const rule2 = createRule(commits.noScope2);

    expect(rule1.check()).toEqual(true);
    expect(rule2.check()).toEqual(true);
  });

  it("Scope has '-' symbol at start/end", () => {
    const rule1 = createRule(commits.invalidScope1);
    const rule2 = createRule(commits.invalidScope2);
    const rule3 = createRule(commits.invalidScope3);
    const rule4 = createRule(commits.invalidScope4);

    expect(() => rule1.check()).toThrow(Error);
    expect(() => rule2.check()).toThrow(Error);
    expect(() => rule3.check()).toThrow(Error);
    expect(() => rule4.check()).toThrow(Error);
  });

  it("Scope placed before header", () => {
    const rule1 = createRule(commits.invalidScopeAtBeginning1);
    const rule2 = createRule(commits.invalidScopeAtBeginning2);

    expect(() => rule1.check()).toThrow(Error);
    expect(() => rule2.check()).toThrow(Error);
  });

  it("Scope with '-' followed by numbers at start/end", () => {
    const rule1 = createRule(commits.scopeHyphenNumber1);
    const rule2 = createRule(commits.scopeHyphenNumber2);
    const rule3 = createRule(commits.scopeHyphenNumber3);

    expect(rule1.check()).toEqual(true);
    expect(rule2.check()).toEqual(true);
    expect(rule3.check()).toEqual(true);
  });

  it("Invalid headers", () => {
    const rule1 = createRule(commits.invalid1);

    expect(() => rule1.check()).toThrow(Error);
  });

  it("Header has 'fixup! '", () => {
    const rule1 = createRule(commits.fixup1);
    const rule2 = createRule(commits.fixup2);

    expect(rule1.check()).toEqual(true);
    expect(rule2.check()).toEqual(true);
  });

  it("Header has `fixup!` with body", () => {
    const rule1 = createRule(commits.fixupWithBody1);
    const rule2 = createRule(commits.fixupWithBody2);

    expect(rule1.check()).toEqual(true);
    expect(rule2.check()).toEqual(true);
  });

  it("Check for header exceptions", () => {
    const rule1 = createRule(commits.exception1);
    const rule2 = createRule(commits.exception2);
    const rule3 = createRule(commits.exception3);

    expect(rule1.check()).toEqual(true);
    expect(rule2.check()).toEqual(true);
    expect(rule3.check()).toEqual(true);
  });

  it("Samples", () => {
    const rule1 = createRule(commits.sample1);
    const rule2 = createRule(commits.sample2);

    expect(rule1.check()).toEqual(true);
    expect(rule2.check()).toEqual(true);
  });

  it("Invalid Header Type", () => {
    const rule1 = createRule(commits.invalidType1);
    const rule2 = createRule(commits.invalidType2);

    expect(() => rule1.check()).toThrow(Error);
    expect(() => rule2.check()).toThrow(Error);
  });

  it("Compulsory Scope (input header has scope)", () => {
    const compulsoryScopeConfig = getConfig(settings);
    compulsoryScopeConfig.compulsoryScope = true;

    const rule1 = new Rule(commits.scope1, compulsoryScopeConfig);
    const rule2 = new Rule(commits.scope2, compulsoryScopeConfig);

    expect(rule1.check()).toEqual(true);
    expect(rule2.check()).toEqual(true);
  });

  it("Compulsory Scope (input header has no scope)", () => {
    const compulsoryScopeConfig = getConfig(settings);
    compulsoryScopeConfig.compulsoryScope = true;

    const rule1 = new Rule(commits.noScope1, compulsoryScopeConfig);
    const rule2 = new Rule(commits.noScope2, compulsoryScopeConfig);

    expect(() => rule1.check()).toThrow(Error);
    expect(() => rule2.check()).toThrow(Error);
  });
});
