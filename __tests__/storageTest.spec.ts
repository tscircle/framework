import 'mocha';
import {Storage} from '../storage/storage';
import {expect} from "chai";


describe('Storage tests', () => {
    it('storage write', () => {
        return Storage.put('message.txt', 'Hello Node')
            .catch((error) => {
                console.log(error);
            });
    });

    it('storage read', () => {
        return Storage.get('message.txt')
            .then((value) => {
                expect(value.toString()).to.eql('Hello Node');
            })
            .catch((error) => {
                console.log(error);
            });
    });

    it('storage delete', () => {
        return Storage.delete('message.txt')
            .then((value) => {
                return Storage.exists('message.txt').then((exists) => {
                    expect(exists).to.eql(false);
                })
            })
            .catch((error) => {
                console.log(error);
            });
    });
});
