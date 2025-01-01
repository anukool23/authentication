import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom"
import { verifyEmail } from "../lib/api";
import { Alert, AlertIcon, Container, Flex, Spinner, Text, VStack, Link as ChakraLink } from "@chakra-ui/react";


const VerifyEmail = () => {
    const {code} = useParams();
    const {isPending, isSuccess,isError} = useQuery({
        queryKey: ["emailVerification",code],
        queryFn: () => verifyEmail(code),
    });
    return (
        <Flex minH={"100vh"} justify={"center"} mt={12}>
            <Container mx={"auto"} maxW={"md"} py={12} px={6} textAlign={"center"}>
                {isPending ? <Spinner /> : <VStack align={"center"} spacing={6}>
                    <Alert status={isSuccess ? "success" : "error"}
                    w={'fit-content'} borderRadius={12}>
                        <AlertIcon />
                        {isSuccess ? "Email verified successfully" : "Email verification failed"}
                    </Alert>
                    {
                        isError && <Text color='grey.400'>
                            This link is either invalid or expired. {" "}
                            <ChakraLink as={Link} to="/password/reset" replace>
                            Get a new Link</ChakraLink>
                        </Text>
                    }
                    <ChakraLink as={Link} to="/" replace>Back to home</ChakraLink>
                    </VStack>}
            </Container>
        </Flex>
    )
}

export default VerifyEmail;