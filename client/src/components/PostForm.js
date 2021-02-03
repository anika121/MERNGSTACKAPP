import React from "react";
import { Form, Button } from "semantic-ui-react";

import { useForm } from "../util/hooks";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { FETCH_POSTS_QUERY } from "../util/graphql";

function PostForm() {
	const { onChange, onSubmit, values } = useForm(createPostCallback, {
		body: "",
	});

	const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
		variables: values,
		update(proxy, result) {
			let data = proxy.readQuery({
				query: FETCH_POSTS_QUERY,
			});
			console.log(result);
			data = {...data, getPosts: [result.data.createPost, ...data.getPosts]};
			proxy.writeQuery({ query: FETCH_POSTS_QUERY, data })
			values.body = "";
		},
	});

	function createPostCallback() {
		createPost();
	}

	return (
		<>
			<Form onSubmit={onSubmit} autoComplete="off">
				<h2>Create A Post:</h2>
				<Form.Field>
					<Form.Input
						placeholder="Body"
						name="body"
						onChange={onChange}
						value={values.body}
						error={error ? true: false}
					/>
					<Button color="teal">Create post</Button>
				</Form.Field>
			</Form>
			{error && (
				<div className="ui error message" style={{ marginBottom: 20}}>
					<ul className="list">
						<li>{error.graphQLErrors[0].message}</li>
					</ul>
				</div>
			)}
		</>
	);
}

const CREATE_POST_MUTATION = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
			id
			body
			createdAt
			username
			likes {
				id
				username
				createdAt
			}
			likeCount
			comments {
				id
				body
				username
				createdAt
			}
			commentCount
		}
	}
`;

export default PostForm;
