import ts from "typescript";
import {evaluate} from "ts-evaluator";

// hardcode our input file
const filePath = "./ble.ts";

// create a program instance, which is a collection of source files
// in this case we only have one source file
const program = ts.createProgram([filePath], {});

const checker = program.getTypeChecker();

const source = program.getSourceFile(filePath)!;

const syntaxToKind = (kind: ts.Node["kind"]) => {
  return ts.SyntaxKind[kind];
};

let indent = 0;
function printTree(node: ts.Node) {
    const padding = new Array(indent + 1).join("  ");

    if(!ts.isSourceFile(node))
    {
        // simplify binary operation on literals
        if(ts.isBinaryExpression(node))
        {
            const [lhs, _, rhs] = node.getChildren();
            if (ts.isLiteralExpression(lhs) && ts.isLiteralExpression(rhs))
            {
                const result = evaluate({
                    node: node,
                    typeChecker: checker,
                });
                if (result.success)
                {
                    console.log(`${padding} simplified to: ${result.value}!`)
                    if (typeof result.value === "string")
                        return ts.createLiteral(result.value);
                    else if (typeof result.value === "boolean")
                        return ts.createLiteral(result.value);
                    else if (typeof result.value === "number")
                        return ts.createLiteral(result.value);
                }
            }
        }

        if(ts.isElementAccessExpression(node))
        {
            const [source, _, accesor] = node.getChildren();
            console.log(`${syntaxToKind(accesor.kind)} ${accesor.getText()}`)
            if(ts.isLiteralExpression(accesor))
            {
                console.log(`${padding} literal access detected!`)
                // TODO: only do the replacement if source is an array/object literal!
                // TODO: add an example for object literal see if it works
                return
            }                
        }

        // TODO: known object access with a known identifier
        // TODO: basic refferential transparency with prompt

        console.log(`${padding} ${syntaxToKind(node.kind)} ${node.getText()}`);
    }

    indent++;
    ts.forEachChild(node, printTree);
    indent--;
}

printTree(source);
