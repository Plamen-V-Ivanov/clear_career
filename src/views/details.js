import { html } from '../../node_modules/lit-html/lit-html.js';
import { applyOffer, deleteOffer, getApplicationsCountByOfferId, getMyApplicationByOfferId, getOfferById } from '../api/data.js';

import { getUserData } from '../util.js';

let detailsTemplate = (offer, isOwner, onDelete, applicationsCount, showApplyButton, onApply) => html`
<section id="details">
    <div id="details-wrapper">
        <img id="details-img" src=${offer.imageUrl} alt="example1" />
        <p id="details-title">${offer.title}</p>
        <p id="details-category">
            Category: <span id="categories">${offer.category}</span>
        </p>
        <p id="details-salary">
            Salary: <span id="salary-number">${offer.salary}</span>
        </p>
        <div id="info-wrapper">
            <div id="details-description">
                <h4>Description</h4>
                <span>${offer.description}</span>
            </div>
            <div id="details-requirements">
                <h4>Requirements</h4>
                <span>${offer.requirements}</span>
            </div>
        </div>
        <p>Applications: <strong id="applications">${applicationsCount}</strong></p>

        <!--Edit and Delete are only for creator-->
        <div id="action-buttons">

            ${offerControlButtonsTemplate(offer, isOwner, onDelete)}
            <!--Bonus - Only for logged-in users ( not authors )-->
            ${offerApplyButtonTemplate(showApplyButton, onApply)}

        </div>
    </div>
</section>
`;



let offerControlButtonsTemplate = (offer, isOwner, onDelete) => {
    if (isOwner) {
        return html`<a href="/edit/${offer._id}" id="edit-btn">Edit</a>
                    <a @click=${onDelete} href="javascript:void(0)" id="delete-btn">Delete</a>`;
    } else {
        return null;
    }
}

let offerApplyButtonTemplate = (showApplyButton, onApply) => {
    if (showApplyButton) {
        return html`<a @click="${onApply}" href="javascript:void(0)" id="apply-btn">Apply</a>`;
    } else {
        return null;
    }
}


export async function detailsView(context) {
    let userData = getUserData();
    let [offer, applicationsCount, hasApplied] = await Promise.all([
        getOfferById(context.params.id),
        getApplicationsCountByOfferId(context.params.id),
        userData ? getMyApplicationByOfferId(context.params.id, userData.id) : 0,

    ]);

    let isOwner = userData && userData.id == offer._ownerId;
    let showApplyButton = isOwner == false && hasApplied == false && userData != null;

    context.render(detailsTemplate(offer, isOwner, onDelete, applicationsCount, showApplyButton, onApply));

    async function onDelete() {

        const choice = confirm('Are you sure you want to delete this offer?');
        if(choice){
            await deleteOffer(context.params.id);
            context.page.redirect('/dashboard');
        }

    }

    async function onApply() {
        await applyOffer(context.params.id);
        context.page.redirect('/offer/' + context.params.id);
    }

}