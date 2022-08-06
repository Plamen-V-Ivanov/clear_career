import { html } from "../../node_modules/lit-html/lit-html.js";
import { createOffer } from "../api/data.js";

const createTemplate = (onSubmit) => html`
        <section id="create">
            <div class="form">
                <h2>Create Offer</h2>
                <form @submit=${onSubmit} class="create-form">
                    <input type="text" name="title" id="job-title" placeholder="Title" />
                    <input type="text" name="imageUrl" id="job-logo" placeholder="Company logo url" />
                    <input type="text" name="category" id="job-category" placeholder="Category" />
                    <textarea id="job-description" name="description" placeholder="Description" rows="4" cols="50"></textarea>
                    <textarea id="job-requirements" name="requirements" placeholder="Requirements" rows="4"
                        cols="50"></textarea>
                    <input type="text" name="salary" id="job-salary" placeholder="Salary" />
        
                    <button type="submit">post</button>
                </form>
            </div>
        </section>`;

export function createView(context) {
    context.render(createTemplate(onSubmit))

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const offer = {
            title: formData.get('title').trim(),
            imageUrl: formData.get('imageUrl').trim(),
            category: formData.get('category').trim(),
            description: formData.get('description').trim(),
            requirements: formData.get('requirements').trim(),
            salary: formData.get('salary').trim(),
        }

        // if (offer.title == '' || offer.description == '' || offer.imageUrl == '' || offer.category == '' || offer.requirements == '' || offer.salary == '') {
        //     return alert('All fields are required');
        // }

        let emptyFields = (Object.values(offer).filter((x) => x == ''));
        if (emptyFields.length != 0) {
            return alert('All fields are required');
        }

        await createOffer(offer);
        event.target.reset();
        context.page.redirect('/dashboard');
    }
}