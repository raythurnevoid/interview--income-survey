# Challenge

## Introduction
Welcome to the challenge for joining *** product team. By submitting a solution to the challenge you will be evaluated for a position as an Engineering Manager (Full Stack) at ***.

In this document you will find two tasks:
1.  A programming task;
2.  A problem-solving task.

## Task 1
### Description
A survey about people's income is underway. You've been tasked to create an app to check the results already collected and register new ones.
Each survey collects the person's:
- First name;
- Last name;
- Date of birth;
- Country (2-letter country code);
- Income (just a numeric value; disregard currency).

We need a simple interface, consisting of a "list" of results and a "form" to submit new ones.

### Server
**Build a simple server to provide the API that will power the app.** The server should come pre-loaded with the survey results already collected - `results.csv`.

### Client
**Build an interface for the app.** The list should be sortable.
- [BONUS] If the list is also searchable.
- [BONUS] If the app is open in more than one tab and a record is created in one of them, the other tabs should show a notification.

### Requirements
There are no hard requirements for the **server** part of the application. You can build it using whatever tech you feel most comfortable with.

For the **client** part, we suggest the following:
- Use **[Vue](https://vuejs.org/)** for UI management.
    - Note: it's fine if you have little/no experience with Vue. We do not expect you to need more than the basics of the framework to get up and running.
- Use **[Axios](https://github.com/axios/axios)** for API communications.
- The use of jQuery, Underscore.js, and other similar libraries is discouraged.
- We're interested to see your use of ES2015+ features, and how you take advantage of the new powerful features of JavaScript to create readable and concise code.
- Feel free to implement the whole solution in TypeScript.
- **We're not expecting the best app ever created**, but there are extra points up for grabs for solutions that take the best UI/UX practices into account!
- **Suggestion:** To save time, we recommend you to set up up your environment using the Vue CLI, since it comes with everything necessary to get up and running (e.g., webpack, hot-reloading, clean structure, etc.).

## Task 2
### _"My website is slow, how can I make it faster?"_
Given a slow web application, can you walk us through how you'd try to determine the root(s) of problems with the application, and how you'd address each problem (i.e., how would you first evaluate whether X is the problem, and how you would solve it)?

You can go as in-depth as you wish with respect to your knowledge of each layer of the stack. For each potential root cause, please also mention which problem you personally think is most likely to be causing the problem.

**NOTE 1:**  The objective of this task is neither to produce a "valid" solution, nor to find whether you can produce a "correct" answer (i.e., there's no "right" answer).

**NOTE 2:**  You can come up with as many solutions as you wish. We are interested to see how you tackle a problem from different angles.

## Submission and next steps
Please, use the repository you're finding this document in to develop your solution(s). Use it freely and make as many commits as you wish.

Ensure the following is part of your submission:
- `TASK1` folder, containing all code pertaining to the first task. Inside the folder you can structure the code however you find best.
- `TASK1.md`, as a readme for your solution to first task. It should:
    - contain any information necessary on how to run the application;
    - (optional) detail decisions/assumptions you made and find relevant.
- `TASK2.md`, containing your solution(s) to the problem-solving challenge.

After the deadline is passed, the product team will clone the repository and evaluate the submitted solution.

Following this, we will schedule a call during which we can go through your solution(s) to the tasks.

If you require any clarification or have any follow-up questions,  **please do not hesitate**  to reach out to us directly.
