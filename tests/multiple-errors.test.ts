import { randomSHA } from "./utils";

import { getDefaultSettings } from "../src/settings";
import { getConfig } from "../src/config";
import { Rule } from "../src/message-helper";

import { MultipleInvalid } from "../src/error-helper";

describe("Multiple errors tests", () => {
  const invalidCommits = {
    BodyHeader: `commit ${randomSHA()}
feat(input: Sample commit subject with scope
- Sample commit body
- Explanation sample`,
    EmptySubjectBody: `commit ${randomSHA()}
feat:`
  };

  it("invalid commit body & header", () => {
    const settings = getDefaultSettings();

    const config = getConfig(settings);

    const rule1 = new Rule(invalidCommits.BodyHeader, config);
    const rule2 = new Rule(invalidCommits.EmptySubjectBody, config);

    expect(() => rule1.check()).toThrow(MultipleInvalid);
    expect(() => rule2.check()).toThrow(Error);
  });
});
