'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import usePost from '../use-post'
import { updateOnePost } from '@/lib/posts'
import { useSession } from '@/app/session-provider'
import { Button, buttonStyles, ErrorList } from '@/components/lib'
import {
	InputTitle,
	InputExcerpt,
	InputContent,
	InputImage,
	InputPublish,
	InputDatestamp,
} from '@/components/form-inputs'
import { PostArticle } from '@/components/post'

export default function Client({ slug, initialData }) {
	const [formError, setFormError] = useState()
	const session = useSession()
	const {
		register,
		watch,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isDirty, isSubmitting, isSubmitSuccessful },
	} = useForm({ defaultValues: initialData })
	const thePost = watch()
	const { back } = useRouter()
	const { post, loadError, isLoading } = usePost(slug, reset)

	const onSubmit = (data) => {
		setFormError()
		reset(data) // reset isDirty immediately, before fetch
		data.content = data.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
		updateOnePost(data).catch(setFormError)
	}

	return (
		<>
			<div className="col-span-2">
				<h1 className="h3">Edit your post</h1>
				<form
					className="form flex flex-col gap-4"
					onSubmit={handleSubmit(onSubmit)}
				>
					<input type="hidden" {...register('id')} />
					<fieldset disabled={!session || isSubmitting || isLoading}>
						<InputTitle register={register} error={errors.title} />
						<InputExcerpt register={register} />
						<InputContent register={register} />
						<InputImage
							register={register}
							error={errors.image}
							setImageValue={(v) => setValue('image', v, { shouldDirty: true })}
							startingValue={thePost.image}
						/>
						<InputPublish register={register} />
						{thePost.published || thePost.published_at ? (
							<InputDatestamp register={register} />
						) : null}

						<div className="flex justify-between items-center my-4">
							<a
								className={buttonStyles({ variant: 'outlines' })}
								onClick={() => back()}
							>
								{isDirty ? 'Cancel' : 'Go back'}
							</a>
							<span className="flex">
								<Button
									type="submit"
									variant="solid"
									disabled={!isDirty || isSubmitting || !session}
								>
									{isSubmitting ? 'Saving...' : 'Save edits'}
								</Button>
								{isSubmitSuccessful && !isDirty && (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="ml-2 h-5 w-5 place-self-center text-green-600"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clipRule="evenodd"
										/>
									</svg>
								)}
							</span>
						</div>
					</fieldset>
					<ErrorList summary="Error saving post" error={formError} />
				</form>
			</div>
			<div className="col-span-2 lg:col-span-3 flex flex-col">
				<ErrorList summary="Error loading post" error={loadError?.message} />
				<div
					style={{
						height: '95vh',
						marginTop: '2.5vh',
						marginBottom: '2.5vh',
					}}
					className="border rounded-lg p-6 pb-16 mx-1 lg:mx-6 overflow-y-auto shadow-lg"
				>
					<PostArticle {...thePost} isLoading={isLoading} />
				</div>
			</div>
		</>
	)
}
