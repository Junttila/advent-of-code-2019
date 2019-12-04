function execute(program: number[], pc: number = 0) {
    let running = program;
    const opcode = program[pc];
    switch(opcode) {
        case 99:
            //console.log(`Stopping program at pc = ${pc}`);
            return running[0];
            break;
        case 1:
            running[running[pc+3]] = running[running[pc+1]] + running[running[pc+2]];
            break;
        case 2: 
            running[running[pc+3]] = running[running[pc+1]] * running[running[pc+2]];
            break;
    }
    //console.log(`pc at ${pc}: performing ${opcode === 1 ? "addition" : "multiplication"} on ${program[pc+1]} and ${program[pc+2]}, storing at ${pc+3}`);
    return execute(running, pc+4);
}

function executeWithInput(program: number[], noun: number, verb: number){
    program[1] = noun;
    program[2] = verb;

    return execute(program, 0);
}


let result = 0;
for (let x = 0; x <= 99 && result !== 19690720; x++) {
    for (let y = 0; y <= 99 && result !== 19690720; y++) {
        const program: number[] = [1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,1,9,19,1,19,5,23,2,23,13,27,1,10,27,31,2,31,6,35,1,5,35,39,1,39,10,43,2,9,43,47,1,47,5,51,2,51,9,55,1,13,55,59,1,13,59,63,1,6,63,67,2,13,67,71,1,10,71,75,2,13,75,79,1,5,79,83,2,83,9,87,2,87,13,91,1,91,5,95,2,9,95,99,1,99,5,103,1,2,103,107,1,10,107,0,99,2,14,0,0];
        result = executeWithInput(program, x, y);
        console.log(`input ${x} and ${y} gave result ${result}`);
    }
}

console.log(result);