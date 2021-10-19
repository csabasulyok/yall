# yall

Yet Another Logging Library

- builds on [winston](https://github.com/winstonjs/winston)
- configurable through [extol](https://github.com/csabasulyok/extol)
- convenience integration for [morgan](https://github.com/expressjs/morgan) and [axios](https://github.com/axios/axios)

## Usage

```ts
import yall from 'yall';

yall.debug('Debug level message');
yall.info('Info level message');
yall.warn('Warn level message');
yall.error('Error level message');
```

## Environment variables

| Name           | Type      | Default value | Description                                                     |
| -------------- | --------- | ------------- | --------------------------------------------------------------- |
| YALL_LEVEL     | `String`  | `info`        | Winston log level                                               |
| YALL_FILENAME  | `String`  | *none*        | File to log messages into (by default, blank = no file logging) |
| YALL_COLORED   | `boolean` | `true`        | Whether to use coloring log formatter                           |
| YALL_TIMESTAMP | `boolean` | `true`        | Whether to prepend log messages with current timestamp          |

## Running example

```bash
# default params
npm run example
# set log level
YALL_LEVEL=debug npm run example
# disable colored output
YALL_COLORED=false npm run example
# disable adding timestamps
YALL_TIMESTAMP=false npm run example
# log to file without color
YALL_FILENAME=out.log YALL_COLORED=false npm run example
```