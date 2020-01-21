

# simplegw

This is a very simple API Gateway intended for use in testing or demos.

It forwards the entire request to a specified server:port based on regular expression matching.

## Configuration

The service pulls rules from environmental variables. All variables that begin `GWRULE` are interpreted as rules. Rules are evaluated in string sorted order of the rule name. For example, rules:

 - `GWRULE_BOB`
 - `GWRULE_ALICE`
 - `GWRULE_01`
would be evaluated in the following order:a
1. `GWRULE_01`
2. `GWRULE_ALICE`
3. `GWRULE_BOB`

The format of the value is as follows:
`SERVER|PATTERN`
Where:
 - `SERVER` must match the pattern: `ADDRESS[:PORT]` `ADDRESS` must either be a DNS name or an IP address.
 - `PATTERN` must be a regular expression.

Here are some example patterns:

- `localhost:8080|^/products.*` will proxy all requests starting with `/products` to `localhost:8080`
- `google.com|^/.*` will proxy all requests to google.com
