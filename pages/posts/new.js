import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import Layout from '../../components/Layout'
import { LoginChallenge } from '../../components/LoginForm'
import ErrorList from '../../components/ErrorList'
import {
  InputTitle,
  InputContent,
  InputSlug,
  InputImage,
} from '../../components/FormInputs'
import { createOnePost } from '../../lib/posts'

export default function New() {
  const {
    register,
    handleSubmit,
    setValue,
    isSubmitting,
    formState: { errors },
  } = useForm()
  const [formError, setFormError] = useState()
  const router = useRouter()
  const onSubmit = data => {
    setFormError()
    data.content = data.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    createOnePost(data)
      .then(() => {
        router.push(`/posts/${data.slug}/edit`)
      })
      .catch(setFormError)
  }

  return (
    <Layout noFooter singleCol>
      <LoginChallenge />
      <main>
        <h1 className="h1">Draft a new post</h1>
        <form
          className="form flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset disabled={isSubmitting}>
            <InputTitle register={register} error={errors.title} />
            <InputSlug register={register} error={errors.slug} />
            <InputImage
              register={register}
              error={errors.image}
              setValue={setValue}
            />
            <InputContent register={register} />

            <div className="flex justify-between">
              <button
                type="submit"
                className="button solid"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              >
                Create Post
              </button>
              <Link href="/">
                <a className="button outline">Back to Home</a>
              </Link>
            </div>
          </fieldset>
          <ErrorList summary="Error creating post" error={formError} />
        </form>
      </main>
    </Layout>
  )
}
