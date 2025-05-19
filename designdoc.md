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


TODO:
* Write a section for the page for showing all previously submitted logs.
* Hook up submitted logs to Open AI for parsing.
* Return parsed logs to user.
* Work on stretch goals like:
    * Retry failed parsing.
    * Search for logs out of previously submitted logs.
    * Classify log severity.
    * Containerizing backend.
    * Deploying the backend and providing a hosted API.
    * Test framework and tests. Might be pretty straight forward for now / light on testing depending on how time permits.