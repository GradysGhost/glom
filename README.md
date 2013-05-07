glom
====

A Node.js HTTP server load tester that attempts to accurately simulate human internet users

## Dependencies

You'll need the following `npm` modules installed to run glom:

 * `jsdom`
 * `optimist`

## Usage

Basic usage looks like this:

    glom -c 20 -s http://yourdomain.whatever/start_here.php

This runs glom with 20 concurrent simulated users, each beginning their browsing at http://www.domain.com/start\_here.php

### Options

<table>
<tr><th>Option</th><th>Long Form</th><th>Description</th><th>Default</th></tr>
<tr><td>-c [num]</td><td>--concurrent-users</td><td>Number of concurrent users to simulate</td><td>10</td></tr>
<tr><td>-d [num]</td><td>--delay</td><td>Maximum number of seconds for the "user" to wait before making another request</td><td>5</td></tr>
<tr><td>-p [pass]</td><td>--password</td><td>The password to use when we do HTTP Basic Auth</td><td>n/a</td></tr>
<tr><td>-u [user]</td><td>--user</td><td>The username to use when we need to use HTTP Basic Auth</td><td>n/a</td></tr>
<tr><td>-s [url]</td><td>--start-page</td><td>The URL for each "user" to start at</td><td>n/a</td></tr>
</table>


