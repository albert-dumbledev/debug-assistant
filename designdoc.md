Assumptions:
* Not currently catering for a highly scalable solution - working on basic wiring and end to end working application.

Considerations:
* Choosing to split the step of submitting logs and sending the logs off for parsing by an LLM initially.
    * This will help make it clear which portion of the system is failing and help make it easier to debug.
    * This can be stitched back together more easily than untangling a continuous flow.
    * I can also use this as a way to retry failed logs or to even "ask for a better response" from the LLM in the historical view. (STRETCH GOAL)
* In summary - my choice of data flow will be:
    1. User submits logs
    2. Server persists logs.
    3. Server sends request to LLM to parse and analyze logs. (depending on size of logs and expected run time, might consider splitting this off to a jobrunner - STRETCH / if required).
    4. Server saves LLM's result.
    5. Server returns LLM's result.
    6. Web app displays result.
* BE/FE language and framework picks are largely comfort based. Mostly working with TS/React these days and didn't want to complicate the system by introducing another language.
    * Project doesn't seem complex enough to warrant a more intentional decision on framework and language.
* Database might be the most interesting decision given we'd have to store a large amount of unstructured data. I suspect something like MongoDB would be a pretty good choice given it's flexibility and that my backend server is in TS, so JSON becomes easy to use too.
    * Alternatively, I could consider using something like an S3 bucket and store the entire log file instead.
* Choice of LLM - key considerations:
    * Accuracy - For coding / debugging, Claude general kept up with or outperformed OpenAI o1 with less resources.
    * Context window - Claude can handle 150% more tokens -- probably more suitable for larger log files.
    * Latency - OpenAI o1 tends to take a lot longer, used for deeper thought and reasoning.
    * Cost - Claude Sonnet is ~4x cheaper than OpenAI o1. Better for everyday tasks.
    * Quick assessment says Claude Sonnet 3.5 is probably a better option for this use case.
    * For this use case, I'll probably just use a free LLM to reduce personal cost but would highly consider further research and result comparison before settling on a model.
        * With this in mind, I think I'll write a wrapper around whatever is handling the LLM Input/Output so it's easy to hotswap.
* Color palette:
    * Picking primary colors:
        * Black (text)
        * White (BG)
        * Grey (containers / right hand nav)
        * Badge colors (red, orange, green, dark grey)
* Security:
    * User input is inherently dangerous - we should santize input so that they cannot inject scripts, break the DB etc.
* Future considerations:
    * UI performance / page load:
        * If there is enough entries, we could consider pagination (limiting number of initial entries and allowing people to load more).
        * We can also add logs directly to the log history as they're submitted instead of refetching to reduce calls to the backend server.
    * Features:
        * We may want to introduce the ability to delete individual entries.
        * A way to continue a debugging conversation - GenAI remembers the context of a previous log entry / submission and uses that to help diagnose the next issue as well.
            * Would need a UI overhaul - either some way to create a new log thread, defaulting the log analysis to continue the existing thread.
            * Log History cards could show card stacks instead, when clicked it could expand as a thread of related logs.

TODO:
* Work on stretch goals like:
    * Retry failed parsing.
    * Search for logs out of previously submitted logs.
    * Containerizing backend.
    * Deploying the backend and providing a hosted API.
    * Test framework and tests. Might be pretty straight forward for now / light on testing depending on how time permits.

Time log:
Day 1 - 2hrs - general scaffold, e2e connectivity between UI and BE.
Day 2 - 3hrs - hooking up to LLM, log analysis, results, log history, UX design.