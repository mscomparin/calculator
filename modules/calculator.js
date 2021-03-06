async function concatAccumulator(status, text) {
	return {
		acc: status.acc + text,
		op: status.op,
		cmd: status.cmd,
		functions: status.functions
	}
}

async function clearAccumulator(status) {
	return {
		acc: '',
		op: status.op,
		cmd: status.cmd,
		functions: status.functions

	}
}

async function getOutput(status) {
	return (status.op + " " + status.cmd + " " + status.acc).trim()
}

async function execExternalFunction(status, funcName) {
	const f = (status && status.functions && status.functions[funcName]) ? status.functions[funcName] : unit
	return f(status)
		.then(() => status)
}

async function unit(status) {
	return status
}

async function execFun(cmd, op1, op2) {
		switch(cmd) {
			case '+': return parseFloat(op1) + parseFloat(op2)
			case '-': return parseFloat(op1) - parseFloat(op2)
			case '*': return parseFloat(op1) * parseFloat(op2)
			case '/': return parseFloat(op1) / parseFloat(op2)
			case '%': return parseFloat(op1) % parseFloat(op2)
			default: return 'error'
		}
}

async function storeOpAndClear(status, cmd) {
	return {
		acc: '',
		op: status.acc,
		cmd: cmd,
		functions: status.functions
	}
}

async function exec(status) {
	return execFun(status.cmd, status.op, status.acc)
		.then(res => {
			return {
				acc: res,
				cmd: '=',
				op: '',
				functions: status.functions
			}
		})
}

async function error(status) {
	return {
		acc: status.acc,
		cmd: status.cmd,
		op: 'E',
		functions: status.functions
	}
}

async function newStatus(functions) {
	return {
		acc: '',
		op: '',
		cmd: '',
		functions: functions
	}
}

async function resetIfEqual(status) {
	if(status.cmd === '=') {
		return {
			cmd: '',
			op: '',
			acc: '',
			functions: status.functions
		}
	} else {
		return status
	}
}

async function toggleAccumulatorSign(status) {
	if(status.acc.startsWith('-')) {
		return {
			acc: status.acc.replace('-',''),
			op: status.op,
			cmd: status.cmd,
			functions: status.functions
		}
	} else {
		return {
			acc: "-" + status.acc,
			op: status.op,
			cmd: status.cmd,
			functions: status.functions
		}
	}
}

async function execCommand(status, cmd) {
		console.log('entered: ', cmd)
		switch(cmd) {
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case '0':
			case '.':
				return resetIfEqual(status)
					.then(res => concatAccumulator(res, cmd))
			case 'clear':
				return clearAccumulator(status)
			case 'plus':
				return storeOpAndClear(status, '+')
			case 'minus':
				if(status.acc !== '') {
					return storeOpAndClear(status, '-')
				} else {
					return toggleAccumulatorSign(status)
				}
			case 'mul':
				return storeOpAndClear(status, '*')
			case 'div':
				return storeOpAndClear(status, '/')
			case 'mod':
				return storeOpAndClear(status, '%')
			case 'equal':
				if(status.cmd === '' || status.cmd === 'E' || status.cmd === '='){
					return unit(status)
				} else {
					return exec(status)
				}
			case 'copy':
				return execExternalFunction(status, 'copy')
			case 'delete':
				return newStatus(status.functions)
			default:
				return error(status)
		}
}

export {
	newStatus,
	execCommand,
	getOutput
}
