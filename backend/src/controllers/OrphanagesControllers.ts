import { getRepository } from 'typeorm'
import{Request, Response} from 'express'
import Orphanage from '../models/Orphanage'
import orphanageView from '../views/orphanages_views'
import * as Yup from 'yup';

export default {
    async index(request: Request, response:Response){
        const orphanagesRepository = getRepository(Orphanage);

        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        });

        return response.json(orphanageView.renderMany(orphanages));
    },
    async show(request: Request, response:Response){
        const { id } = request.params;

        const orphanagesRepository = getRepository(Orphanage);

        const orphanage = await orphanagesRepository.findOneOrFail(id, {
          relations: ['images']  
        });

        return response.json(orphanageView.render(orphanage));
    },
    async create(request: Request, response:Response){
        const {
            name,
            latitude,
            longitude,
            about,
            insntructions,
            opening_hours,
            open_on_weekends,
        } = request.body;
    
        const orphanagesRepository = getRepository(Orphanage);
       
        const requestImages = request.files as Express.Multer.File[];
       
        const images = requestImages.map(image => { return {path: image.filename } })
    
        const data = {
            name,
            latitude,
            longitude,
            insntructions,
            about,
            opening_hours,
            open_on_weekends: open_on_weekends == true,
            images
        }

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude:Yup.number().required(),
            insntructions:Yup.string().required(),
            about:Yup.string().required().max(380),
            opening_hours:Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            images: Yup.array(Yup.object().shape({
                path: Yup.string().required()
            }))
        })


        await schema.validate(data, {
            abortEarly: false,
        })

        const orphanages = orphanagesRepository.create(data);
    
        await orphanagesRepository.save(orphanages);
    
        return response.status(201).json(orphanages)
    }
};